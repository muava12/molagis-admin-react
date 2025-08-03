import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Edit01, Trash01, MessageCircle02, SearchLg } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { ModalOverlay, Modal, Dialog } from "@/components/application/modals/modal";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { TextArea } from "@/components/base/textarea/textarea";
import { Table, TableCard } from "@/components/application/table/table";
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

    // Debounce search query to avoid too many API calls
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    // Fetch customers with pagination and search
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

    // Effect to fetch data when page or search changes
    useEffect(() => {
        fetchCustomers({
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            search: debouncedSearchQuery,
        });
    }, [currentPage, debouncedSearchQuery, fetchCustomers]);

    // Reset to first page when search changes
    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [debouncedSearchQuery]);

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
            });
            handleCloseModal();
        } catch (error) {
            console.error('Error saving customer:', error);
            setError('Failed to save customer. Please try again.');
        }
    }, [formData, editingCustomer, fetchCustomers, currentPage, debouncedSearchQuery, handleCloseModal]);

    const handleDelete = useCallback(async (customerId: number) => {
        if (confirm('Are you sure you want to delete this customer?')) {
            try {
                await CustomerService.deleteCustomer(customerId);
                // Refresh current page data
                await fetchCustomers({
                    page: currentPage,
                    limit: ITEMS_PER_PAGE,
                    search: debouncedSearchQuery,
                });
            } catch (error) {
                console.error('Error deleting customer:', error);
                setError('Failed to delete customer. Please try again.');
            }
        }
    }, [fetchCustomers, currentPage, debouncedSearchQuery]);

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

    // Memoized customer rows for better performance
    const customerRows = useMemo(() => {
        return paginatedData.data.map((customer) => (
            <Table.Row key={customer.id} className="hover:bg-primary_hover">
                <Table.Cell>
                    <div className="text-sm font-medium text-fg-primary">
                        {customer.nama}
                    </div>
                </Table.Cell>
                <Table.Cell>
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
                </Table.Cell>
                <Table.Cell>
                    <div className="text-sm text-fg-secondary">
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
                </Table.Cell>
                <Table.Cell>
                    <span className="text-fg-primary">
                        {formatCurrency(customer.ongkir)}
                    </span>
                </Table.Cell>
                <Table.Cell>
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
                </Table.Cell>
            </Table.Row>
        ));
    }, [paginatedData.data, createWhatsAppLink, formatCurrency, handleOpenModal, handleDelete]);

    // Generate pagination buttons
    const paginationButtons = useMemo(() => {
        const buttons = [];
        const { page, totalPages } = paginatedData;
        
        // Previous button
        buttons.push(
            <Button
                key="prev"
                size="sm"
                color="secondary"
                onClick={() => handlePageChange(page - 1)}
                isDisabled={page <= 1}
            >
                Previous
            </Button>
        );

        // Page numbers
        const startPage = Math.max(1, page - 2);
        const endPage = Math.min(totalPages, page + 2);

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <Button
                    key={i}
                    size="sm"
                    color={i === page ? "primary" : "secondary"}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Button>
            );
        }

        // Next button
        buttons.push(
            <Button
                key="next"
                size="sm"
                color="secondary"
                onClick={() => handlePageChange(page + 1)}
                isDisabled={page >= totalPages}
            >
                Next
            </Button>
        );

        return buttons;
    }, [paginatedData, handlePageChange]);

    if (loading && paginatedData.data.length === 0) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="space-y-4 text-center">
                    <div className="flex justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                    <div className="text-lg text-fg-secondary">Loading customers...</div>
                </div>
            </div>
        );
    }

    // Show skeleton loading for table rows when loading but data exists
    const renderTableContent = () => {
        if (loading && paginatedData.data.length > 0) {
            return (
                <div className="overflow-x-auto">
                    <Table>
                        <Table.Header>
                            <Table.Head label="Name" isRowHeader />
                            <Table.Head label="WhatsApp" />
                            <Table.Head label="Address" />
                            <Table.Head label="Shipping Cost" />
                            <Table.Head label="Actions" />
                        </Table.Header>
                        <Table.Body>
                            {Array.from({ length: 5 }).map((_, rowIndex) => (
                                <Table.Row key={rowIndex}>
                                    {Array.from({ length: 5 }).map((_, cellIndex) => (
                                        <Table.Cell key={cellIndex}>
                                            <div className="h-4 w-24 bg-secondary rounded animate-pulse"></div>
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <Table>
                    <Table.Header>
                        <Table.Head label="Name" isRowHeader />
                        <Table.Head label="WhatsApp" />
                        <Table.Head label="Address" />
                        <Table.Head label="Shipping Cost" />
                        <Table.Head label="Actions" />
                    </Table.Header>
                    <Table.Body>
                        {customerRows}
                    </Table.Body>
                </Table>

                {paginatedData.data.length === 0 && !loading && (
                    <div className="py-12 text-center">
                        <div className="text-fg-tertiary">
                            {searchQuery ? `No customers found for "${searchQuery}"` : "No customers found"}
                        </div>
                        {!searchQuery && (
                            <Button
                                onClick={() => handleOpenModal()}
                                className="mt-4"
                                color="secondary"
                            >
                                Add your first customer
                            </Button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-fg-primary">Customers</h1>
                    <p className="mt-2 text-fg-secondary">
                        Manage your customer database - {paginatedData.total} customers total
                    </p>
                </div>
                <Button
                    onClick={() => handleOpenModal()}
                    color="primary"
                    size="lg"
                    iconLeading={Plus}
                >
                    Add Customer
                </Button>
            </div>

            {/* Search and Error */}
            <div className="space-y-4">
                <Input
                    placeholder="Search customers by name..."
                    value={searchQuery}
                    onChange={(value) => setSearchQuery(value)}
                    icon={SearchLg}
                    className="max-w-md"
                />

                {error && (
                    <div className="rounded-lg bg-error-50 border border-error-200 p-4 text-error-700">
                        {error}
                        <button
                            onClick={() => setError(null)}
                            className="ml-2 text-error-500 hover:text-error-700"
                        >
                            ×
                        </button>
                    </div>
                )}
            </div>

            {/* Table Section */}
            <div className="rounded-xl border border-secondary bg-primary overflow-hidden">
                <div className="px-6 py-4 border-b border-secondary">
                    <h3 className="text-lg font-semibold text-fg-primary">
                        Customer Directory
                    </h3>
                </div>
                {renderTableContent()}
                
                {/* Pagination */}
                {paginatedData.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-secondary flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-fg-tertiary">
                            Showing {((paginatedData.page - 1) * paginatedData.limit) + 1} to{' '}
                            {Math.min(paginatedData.page * paginatedData.limit, paginatedData.total)} of{' '}
                            {paginatedData.total} customers
                        </div>
                        <div className="flex items-center gap-2">
                            {paginationButtons}
                        </div>
                    </div>
                )}
            </div>

            {/* Customer Form Modal - Only render when open */}
            {isModalOpen && (
                <ModalOverlay isOpen={isModalOpen}>
                    <Modal>
                        <Dialog>
                            <div className="bg-primary rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                                <h2 className="text-lg font-semibold mb-4 text-fg-primary">
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
        </div>
    );
};