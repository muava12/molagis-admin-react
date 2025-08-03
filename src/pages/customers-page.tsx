import { useState, useEffect, useCallback, useMemo } from "react";
import { FilterLines, Plus, SearchLg, UploadCloud02, Edit01, Trash01, MessageCircle02 } from "@untitledui/icons";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { TableCard, TableRowActionsDropdown } from "@/components/application/table/table";
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { ModalOverlay, Modal, Dialog } from "@/components/application/modals/modal";
import { TextArea } from "@/components/base/textarea/textarea";
import { CustomerService, type PaginationParams, type PaginatedResponse } from "@/services/customerService";
import type { Customer, CustomerInsert } from "@/lib/supabase";
import { useDebounce } from "@/hooks/use-debounce";

interface CustomerFormData {
    nama: string;
    alamat: string;
    telepon: string;
    telepon_alt: string;
    telepon_pemesan: string;
    maps: string;
    ongkir: string;
}

const ITEMS_PER_PAGE = 10;

export const CustomersPage = () => {
    const [paginatedData, setPaginatedData] = useState<PaginatedResponse<Customer>>({
        data: [],
        total: 0,
        page: 1,
        limit: ITEMS_PER_PAGE,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [formData, setFormData] = useState<CustomerFormData>({
        nama: "",
        alamat: "",
        telepon: "",
        telepon_alt: "",
        telepon_pemesan: "",
        maps: "",
        ongkir: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    
    // Load sorting state from localStorage or use defaults
    const [sortBy, setSortBy] = useState<string>(() => {
        return localStorage.getItem('customers-sort-by') || 'date_created';
    });
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">(() => {
        return (localStorage.getItem('customers-sort-order') as "asc" | "desc") || 'desc';
    });
    const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

    // Debounce search query to avoid too many API calls
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    // Fetch customers with pagination, search, sorting, and filtering
    const fetchCustomers = useCallback(async (params: PaginationParams) => {
        try {
            setLoading(true);
            setError(null);
            const data = await CustomerService.getCustomersPaginated(params);
            setPaginatedData(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
            setError('Failed to load customers. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Effect to fetch data when parameters change
    useEffect(() => {
        fetchCustomers({
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            search: debouncedSearchQuery,
            sortBy,
            sortOrder,
            filter,
        });
    }, [currentPage, debouncedSearchQuery, sortBy, sortOrder, filter, fetchCustomers]);

    // Reset to first page when search or filter changes
    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [debouncedSearchQuery, filter]);

    const handleOpenModal = useCallback((customer?: Customer) => {
        if (customer) {
            setEditingCustomer(customer);
            setFormData({
                nama: customer.nama || "",
                alamat: customer.alamat || "",
                telepon: customer.telepon || "",
                telepon_alt: customer.telepon_alt || "",
                telepon_pemesan: customer.telepon_pemesan || "",
                maps: customer.maps || "",
                ongkir: customer.ongkir?.toString() || "",
            });
        } else {
            setEditingCustomer(null);
            setFormData({
                nama: "",
                alamat: "",
                telepon: "",
                telepon_alt: "",
                telepon_pemesan: "",
                maps: "",
                ongkir: "",
            });
        }
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingCustomer(null);
        setFormData({
            nama: "",
            alamat: "",
            telepon: "",
            telepon_alt: "",
            telepon_pemesan: "",
            maps: "",
            ongkir: "",
        });
    }, []);

    const handleInputChange = useCallback((field: keyof CustomerFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const customerData: CustomerInsert = {
                nama: formData.nama,
                alamat: formData.alamat || undefined,
                telepon: formData.telepon || undefined,
                telepon_alt: formData.telepon_alt || undefined,
                telepon_pemesan: formData.telepon_pemesan || undefined,
                maps: formData.maps || undefined,
                ongkir: formData.ongkir ? parseFloat(formData.ongkir) : undefined,
            };

            if (editingCustomer) {
                await CustomerService.updateCustomer(editingCustomer.id, customerData);
            } else {
                await CustomerService.createCustomer(customerData);
            }

            // Refresh current page data
            await fetchCustomers({
                page: currentPage,
                limit: ITEMS_PER_PAGE,
                search: debouncedSearchQuery,
                sortBy,
                sortOrder,
                filter,
            });
            handleCloseModal();
        } catch (error) {
            console.error('Error saving customer:', error);
            setError('Failed to save customer. Please try again.');
        }
    }, [formData, editingCustomer, fetchCustomers, currentPage, debouncedSearchQuery, sortBy, sortOrder, filter, handleCloseModal]);

    const handleDelete = useCallback(async (customerId: number) => {
        if (confirm('Are you sure you want to delete this customer?')) {
            try {
                await CustomerService.deleteCustomer(customerId);
                // Refresh current page data
                await fetchCustomers({
                    page: currentPage,
                    limit: ITEMS_PER_PAGE,
                    search: debouncedSearchQuery,
                    sortBy,
                    sortOrder,
                    filter,
                });
            } catch (error) {
                console.error('Error deleting customer:', error);
                setError('Failed to delete customer. Please try again.');
            }
        }
    }, [fetchCustomers, currentPage, debouncedSearchQuery, sortBy, sortOrder, filter]);

    const formatCurrency = useCallback((amount?: number) => {
        if (!amount) return '-';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    }, []);

    // Create WhatsApp link
    const createWhatsAppLink = useCallback((phone: string) => {
        const cleanPhone = phone.replace(/\D/g, '');
        const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
        return `https://wa.me/${formattedPhone}`;
    }, []);

    // Handle pagination
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    // Handle sorting with localStorage persistence
    const handleSort = useCallback((column: string) => {
        let newSortOrder: "asc" | "desc";
        if (sortBy === column) {
            newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        } else {
            newSortOrder = "asc";
        }
        
        setSortBy(column);
        setSortOrder(newSortOrder);
        
        // Save to localStorage
        localStorage.setItem('customers-sort-by', column);
        localStorage.setItem('customers-sort-order', newSortOrder);
    }, [sortBy, sortOrder]);

    // Handle filter change
    const handleFilterChange = useCallback((newFilter: "all" | "active" | "inactive") => {
        setFilter(newFilter);
    }, []);

    // Clear search
    const handleClearSearch = useCallback(() => {
        setSearchQuery("");
    }, []);

    // Format date for display
    const formatDate = useCallback((dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }, []);

    // Render table content with proper structure
    const renderTableContent = () => {
        if (loading && paginatedData.data.length === 0) {
            return (
                <div className="flex items-center justify-center overflow-hidden px-8 pt-10 pb-12">
                    <div className="space-y-4 text-center">
                        <div className="flex justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        </div>
                        <div className="text-lg text-fg-secondary">Loading customers...</div>
                    </div>
                </div>
            );
        }

        if (paginatedData.data.length === 0 && !loading) {
            return (
                <div className="flex items-center justify-center overflow-hidden px-8 pt-10 pb-12">
                    <EmptyState size="sm">
                        <EmptyState.Header pattern="circle">
                            <EmptyState.FeaturedIcon color="gray" theme="modern-neue" />
                        </EmptyState.Header>

                        <EmptyState.Content>
                            <EmptyState.Title>No customers found</EmptyState.Title>
                            <EmptyState.Description>
                                {searchQuery 
                                    ? `Your search "${searchQuery}" did not match any customers. Please try again or add a new customer.`
                                    : "You haven't added any customers yet. Create your first customer to get started."
                                }
                            </EmptyState.Description>
                        </EmptyState.Content>

                        <EmptyState.Footer>
                            {searchQuery && (
                                <Button size="md" color="secondary" onClick={handleClearSearch}>
                                    Clear search
                                </Button>
                            )}
                            <Button size="md" iconLeading={Plus} onClick={() => handleOpenModal()}>
                                Add customer
                            </Button>
                        </EmptyState.Footer>
                    </EmptyState>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-secondary border-b border-secondary">
                        <tr>
                            <th 
                                className="px-6 py-3 text-left text-xs font-semibold text-quaternary cursor-pointer hover:text-tertiary"
                                onClick={() => handleSort('nama')}
                            >
                                <div className="flex items-center gap-1">
                                    Name
                                    {sortBy === 'nama' && (
                                        <span className={`text-xs ${sortOrder === 'asc' ? 'rotate-0' : 'rotate-180'}`}>↑</span>
                                    )}
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-quaternary">
                                Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-quaternary">
                                Address
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-semibold text-quaternary cursor-pointer hover:text-tertiary"
                                onClick={() => handleSort('date_created')}
                            >
                                <div className="flex items-center gap-1">
                                    Created Date
                                    {sortBy === 'date_created' && (
                                        <span className={`text-xs ${sortOrder === 'asc' ? 'rotate-0' : 'rotate-180'}`}>↑</span>
                                    )}
                                </div>
                            </th>
                            <th
                                className="px-6 py-3 text-left text-xs font-semibold text-quaternary cursor-pointer hover:text-tertiary"
                                onClick={() => handleSort('ongkir')}
                            >
                                <div className="flex items-center gap-1">
                                    Shipping Cost
                                    {sortBy === 'ongkir' && (
                                        <span className={`text-xs ${sortOrder === 'asc' ? 'rotate-0' : 'rotate-180'}`}>↑</span>
                                    )}
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-quaternary">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary">
                        {paginatedData.data.map((customer) => (
                            <tr key={customer.id} className="hover:bg-secondary transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm font-medium text-primary">
                                            {customer.nama}
                                        </div>
                                        {(customer as any).hasActiveOrders && (
                                            <div className="flex items-center justify-center w-2 h-2 bg-success-500 rounded-full" title="Has active orders">
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {customer.telepon && (
                                            <a
                                                href={createWhatsAppLink(customer.telepon)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center w-8 h-8 bg-success-500 hover:bg-success-600 rounded-full transition-colors"
                                                title={`WhatsApp: ${customer.telepon}`}
                                            >
                                                <MessageCircle02 className="size-4 text-white" />
                                            </a>
                                        )}
                                        {customer.telepon_alt && (
                                            <a
                                                href={createWhatsAppLink(customer.telepon_alt)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center w-8 h-8 bg-success-400 hover:bg-success-500 rounded-full transition-colors"
                                                title={`WhatsApp Alt: ${customer.telepon_alt}`}
                                            >
                                                <MessageCircle02 className="size-4 text-white" />
                                            </a>
                                        )}
                                        {customer.telepon_pemesan && (
                                            <a
                                                href={createWhatsAppLink(customer.telepon_pemesan)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center w-8 h-8 bg-primary-500 hover:bg-primary-600 rounded-full transition-colors"
                                                title={`WhatsApp Pemesan: ${customer.telepon_pemesan}`}
                                            >
                                                <MessageCircle02 className="size-4 text-white" />
                                            </a>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-tertiary">
                                        {customer.alamat && (
                                            <div className="max-w-xs truncate">
                                                {customer.alamat}
                                            </div>
                                        )}
                                        {customer.maps && (
                                            <a
                                                href={customer.maps}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-brand-600 hover:text-brand-800 text-xs"
                                            >
                                                View Map →
                                            </a>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-tertiary">
                                        {formatDate(customer.date_created)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-primary">
                                        {formatCurrency(customer.ongkir)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            color="secondary"
                                            onClick={() => handleOpenModal(customer)}
                                            iconLeading={Edit01}
                                        />
                                        <Button
                                            size="sm"
                                            color="tertiary-destructive"
                                            onClick={() => handleDelete(customer.id)}
                                            iconLeading={Trash01}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <TableCard.Root>
            <TableCard.Header
                title="Customer Management"
                badge={`${paginatedData.total} customers`}
                description="Keep track of customers and their information."
                contentTrailing={
                    <>
                        <div className="flex gap-3 md:pr-9">
                            <Button color="secondary" size="md" iconLeading={UploadCloud02}>
                                Import
                            </Button>
                            <Button size="md" iconLeading={Plus} onClick={() => handleOpenModal()}>
                                Add customer
                            </Button>
                        </div>
                        <div className="absolute top-5 right-4 md:right-6">
                            <TableRowActionsDropdown />
                        </div>
                    </>
                }
            />

            <div className="flex justify-between gap-4 border-b border-secondary px-4 py-3 md:px-6">
                <ButtonGroup defaultSelectedKeys={[filter]} onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as "all" | "active" | "inactive";
                    handleFilterChange(selectedKey);
                }}>
                    <ButtonGroupItem id="all">View all</ButtonGroupItem>
                    <ButtonGroupItem id="active">Active</ButtonGroupItem>
                    <ButtonGroupItem id="inactive">Inactive</ButtonGroupItem>
                </ButtonGroup>

                <div className="hidden gap-3 md:flex">
                    <Input 
                        icon={SearchLg} 
                        aria-label="Search" 
                        placeholder="Search customers..." 
                        className="w-70"
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />
                    <Button size="md" color="secondary" iconLeading={FilterLines}>
                        Filters
                    </Button>
                </div>
            </div>

            {error && (
                <div className="mx-4 my-3 md:mx-6 rounded-lg bg-error-50 border border-error-200 p-4 text-error-700">
                    {error}
                    <button
                        onClick={() => setError(null)}
                        className="ml-2 text-error-500 hover:text-error-700"
                    >
                        ×
                    </button>
                </div>
            )}

            {renderTableContent()}

            {paginatedData.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-secondary px-6 pt-3 pb-4">
                    <span className="text-sm text-tertiary">
                        Page {paginatedData.page} of {paginatedData.totalPages}
                    </span>
                    <div className="flex gap-3">
                        <Button 
                            color="secondary" 
                            size="sm"
                            onClick={() => handlePageChange(paginatedData.page - 1)}
                            isDisabled={paginatedData.page <= 1}
                        >
                            Previous
                        </Button>
                        <Button 
                            color="secondary" 
                            size="sm"
                            onClick={() => handlePageChange(paginatedData.page + 1)}
                            isDisabled={paginatedData.page >= paginatedData.totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Customer Form Modal */}
            {isModalOpen && (
                <ModalOverlay isOpen={isModalOpen}>
                    <Modal>
                        <Dialog>
                            <div className="bg-primary rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                                <h2 className="text-lg font-semibold mb-4 text-primary">
                                    {editingCustomer ? "Edit Customer" : "Add New Customer"}
                                </h2>
                                
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <Input
                                        label="Customer Name"
                                        value={formData.nama}
                                        onChange={(value) => handleInputChange('nama', value)}
                                        isRequired
                                        placeholder="Enter customer name"
                                    />

                                    <Input
                                        label="Phone Number"
                                        type="tel"
                                        value={formData.telepon}
                                        onChange={(value) => handleInputChange('telepon', value)}
                                        placeholder="Enter phone number"
                                    />

                                    <Input
                                        label="Alternative Phone"
                                        type="tel"
                                        value={formData.telepon_alt}
                                        onChange={(value) => handleInputChange('telepon_alt', value)}
                                        placeholder="Enter alternative phone number"
                                    />

                                    <Input
                                        label="Orderer's Phone"
                                        type="tel"
                                        value={formData.telepon_pemesan}
                                        onChange={(value) => handleInputChange('telepon_pemesan', value)}
                                        placeholder="Enter orderer's phone number"
                                    />

                                    <TextArea
                                        label="Address"
                                        value={formData.alamat}
                                        onChange={(e: any) => handleInputChange('alamat', e.target.value)}
                                        placeholder="Enter customer address"
                                        rows={3}
                                    />

                                    <Input
                                        label="Maps Link"
                                        type="url"
                                        value={formData.maps}
                                        onChange={(value) => handleInputChange('maps', value)}
                                        placeholder="Enter Google Maps link"
                                    />

                                    <Input
                                        label="Shipping Cost (IDR)"
                                        type="number"
                                        value={formData.ongkir}
                                        onChange={(value) => handleInputChange('ongkir', value)}
                                        placeholder="Enter shipping cost"
                                    />

                                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                                        <Button
                                            type="button"
                                            color="secondary"
                                            onClick={handleCloseModal}
                                            className="w-full sm:w-auto"
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" className="w-full sm:w-auto">
                                            {editingCustomer ? "Update Customer" : "Add Customer"}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </Dialog>
                    </Modal>
                </ModalOverlay>
            )}
        </TableCard.Root>
    );
};