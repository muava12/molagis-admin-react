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
            <Table.Row key={customer.id}>
                <Table.Cell>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
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
                                className="flex items-center justify-center w-8 h-8 bg-green-500 hover:bg-green-600 rounded-full transition-colors"
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
                                className="flex items-center justify-center w-8 h-8 bg-green-400 hover:bg-green-500 rounded-full transition-colors"
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
                                className="flex items-center justify-center w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
                                title={`WhatsApp Pemesan: ${customer.telepon_pemesan}`}
                            >
                                <MessageCircle02 className="size-4 text-white" />
                            </a>
                        )}
                    </div>
                </Table.Cell>
                <Table.Cell>
                    <div className="text-sm text-gray-900 dark:text-gray-300">
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
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs"
                            >
                                View Map →
                            </a>
                        )}
                    </div>
                </Table.Cell>
                <Table.Cell>
                    <span className="text-gray-900 dark:text-gray-300">
                        {formatCurrency(customer.ongkir)}
                    </span>
                </Table.Cell>
                <Table.Cell>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            color="tertiary"
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
                <div className="text-lg">Loading customers...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                            {paginatedData.total} customers total
                        </p>
                    </div>
                    <Button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 w-full sm:w-auto justify-center"
                        iconLeading={Plus}
                    >
                        Add Customer
                    </Button>
                </div>

                {/* Search Bar */}
                <div className="mt-4">
                    <Input
                        placeholder="Search customers by name..."
                        value={searchQuery}
                        onChange={(value) => setSearchQuery(value)}
                        icon={SearchLg}
                        className="max-w-md"
                    />
                </div>

                {error && (
                    <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-red-700 dark:text-red-400">
                        {error}
                        <button 
                            onClick={() => setError(null)}
                            className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                            ×
                        </button>
                    </div>
                )}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-auto px-4 sm:px-6 py-4">
                <div className="overflow-x-auto">
                    <TableCard.Root>
                        <Table>
                            <Table.Header>
                                <Table.Head label="Name" />
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
                                <div className="text-gray-500 dark:text-gray-400">
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
                    </TableCard.Root>
                </div>

                {/* Pagination */}
                {paginatedData.totalPages > 1 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
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
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
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