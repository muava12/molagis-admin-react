import { useState, useEffect } from "react";
import { Plus, Edit01, Trash01, Phone, ArrowRight } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { ModalOverlay, Modal, Dialog } from "@/components/application/modals/modal";
import { Input } from "@/components/base/input/input";
import { Label } from "@/components/base/input/label";
import { TextArea } from "@/components/base/textarea/textarea";
import { Table, TableCard } from "@/components/application/table/table";
import { CustomerService } from "@/services/customerService";
import type { Customer, CustomerInsert } from "@/lib/supabase";

interface CustomerFormData {
    nama: string;
    alamat: string;
    telepon: string;
    telepon_alt: string;
    telepon_pemesan: string;
    maps: string;
    ongkir: string;
}

export const CustomersPage = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
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

    // Fetch customers from Supabase
    const fetchCustomers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await CustomerService.getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
            setError('Failed to load customers. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleOpenModal = (customer?: Customer) => {
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
    };

    const handleCloseModal = () => {
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
    };

    const handleInputChange = (field: keyof CustomerFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
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

            await fetchCustomers();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving customer:', error);
            setError('Failed to save customer. Please try again.');
        }
    };

    const handleDelete = async (customerId: number) => {
        if (confirm('Are you sure you want to delete this customer?')) {
            try {
                await CustomerService.deleteCustomer(customerId);
                await fetchCustomers();
            } catch (error) {
                console.error('Error deleting customer:', error);
                setError('Failed to delete customer. Please try again.');
            }
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID');
    };

    const formatCurrency = (amount?: number) => {
        if (!amount) return '-';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-lg">Loading customers...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                    <p className="text-gray-600">Manage your customer database</p>
                </div>
                <Button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2"
                    iconLeading={Plus}
                >
                    Add Customer
                </Button>
            </div>

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
                    {error}
                    <button 
                        onClick={() => setError(null)}
                        className="ml-2 text-red-500 hover:text-red-700"
                    >
                        ×
                    </button>
                </div>
            )}

            <TableCard.Root>
                <Table>
                    <Table.Header>
                        <Table.Head label="Name" />
                        <Table.Head label="Contact" />
                        <Table.Head label="Address" />
                        <Table.Head label="Shipping Cost" />
                        <Table.Head label="Date Created" />
                        <Table.Head label="Actions" />
                    </Table.Header>
                    <Table.Body>
                        {customers.map((customer) => (
                            <Table.Row key={customer.id}>
                                <Table.Cell>
                                    <div className="text-sm font-medium text-gray-900">
                                        {customer.nama}
                                    </div>
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="text-sm text-gray-900">
                                        {customer.telepon && (
                                            <div className="flex items-center gap-1">
                                                <Phone className="size-3" />
                                                {customer.telepon}
                                            </div>
                                        )}
                                        {customer.telepon_alt && (
                                            <div className="flex items-center gap-1 text-gray-500">
                                                <Phone className="size-3" />
                                                {customer.telepon_alt}
                                            </div>
                                        )}
                                    </div>
                                </Table.Cell>
                                <Table.Cell>
                                    <div className="text-sm text-gray-900">
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
                                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                            >
                                                <ArrowRight className="size-3" />
                                                View Map
                                            </a>
                                        )}
                                    </div>
                                </Table.Cell>
                                <Table.Cell>
                                    {formatCurrency(customer.ongkir)}
                                </Table.Cell>
                                <Table.Cell>
                                    {formatDate(customer.date_created)}
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
                        ))}
                    </Table.Body>
                </Table>

                {customers.length === 0 && !loading && (
                    <div className="py-12 text-center">
                        <div className="text-gray-500">No customers found</div>
                        <Button
                            onClick={() => handleOpenModal()}
                            className="mt-4"
                            color="secondary"
                        >
                            Add your first customer
                        </Button>
                    </div>
                )}
            </TableCard.Root>

            {/* Customer Form Modal */}
            {isModalOpen && (
                <ModalOverlay isOpen={isModalOpen}>
                    <Modal>
                        <Dialog>
                            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                <h2 className="text-lg font-semibold mb-4">
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

                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button
                                            type="button"
                                            color="secondary"
                                            onClick={handleCloseModal}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit">
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