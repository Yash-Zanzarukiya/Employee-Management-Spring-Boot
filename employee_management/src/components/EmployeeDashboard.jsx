import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Search, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "./ui/skeleton";

export default function EmployeeDashboard() {
    const [employees, setEmployees] = useState([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        fetchEmployees();
    }, [isDarkMode]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newEmployee = {
            id: editingEmployee ? editingEmployee.id : Date.now(),
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
        };

        if (editingEmployee) {
            updateEmployee(newEmployee);
        } else {
            addEmployee(newEmployee);
        }

        setIsAddDialogOpen(false);
        setEditingEmployee(null);
    };

    const addEmployee = async (newEmployee) => {
        try {
            await fetch("http://localhost:8080/api/v1/employee", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newEmployee),
            });
            setEmployees([...employees, newEmployee]);
        } catch (error) {
            console.error("Error adding employee", error);
        }
    };

    const updateEmployee = async (updatedEmployee) => {
        try {
            await fetch(`http://localhost:8080/api/v1/employee/${updatedEmployee.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedEmployee),
            });
            setEmployees(
                employees.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
            );
        } catch (error) {
            console.error("Error updating employee", error);
        }
    };

    const handleDelete = (id) => {
        try {
            fetch(`http://localhost:8080/api/v1/employee/${id}`, {
                method: "DELETE",
            });
            setEmployees(employees.filter((employee) => employee.id !== id));
        } catch (error) {
            console.error("Error deleting employee", error);
        }
    };

    const fetchEmployees = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api/v1/employee");
            const data = await response.json();
            setEmployees(
                data.map((emp) => ({
                    id: emp.id,
                    name: emp.name,
                    email: emp.email,
                    phone: emp.phone,
                }))
            );
        } catch (error) {
            console.error("Error fetching employees", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredEmployees = employees.filter(
        (employee) =>
            employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.phone.includes(searchTerm)
    );

    return (
        <div
            className={`min-h-screen bg-gradient-to-r from-background/50 to-background transition-colors duration-200`}
        >
            <div className="bg-[url('/placeholder.svg?height=200&width=1920')] bg-primary bg-center relative">
                <div className="absolute inset-0 bg-black opacity-50 dark:opacity-70"></div>
                <div className="container mx-auto py-16 relative z-10">
                    <div className="flex justify-between items-center">
                        <div className="pl-10">
                            <h1 className="text-4xl font-bold mb-2 text-white">
                                Employee Management Dashboard
                            </h1>
                            <p className="text-xl text-white opacity-80">
                                Manage your team efficiently
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="text-primary border-white hover:bg-white hover:text-gray-900 mr-4"
                        >
                            {isDarkMode ? (
                                <Sun className="h-[1.2rem] w-[1.2rem]" />
                            ) : (
                                <Moon className="h-[1.2rem] w-[1.2rem]" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
            <div className="container mx-auto p-8">
                <Card className="dark:bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl font-bold dark:text-white">
                            Employee Directory
                        </CardTitle>
                        <Dialog
                            open={isAddDialogOpen || !!editingEmployee}
                            onOpenChange={(open) => {
                                setIsAddDialogOpen(open);
                                if (!open) setEditingEmployee(null);
                            }}
                        >
                            <DialogTrigger asChild>
                                <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800">
                                    Add New Employee
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="dark:bg-card">
                                <DialogHeader>
                                    <DialogTitle className="dark:text-white">
                                        {editingEmployee ? "Edit Employee" : "Add New Employee"}
                                    </DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <Input
                                        name="name"
                                        placeholder="Name"
                                        defaultValue={editingEmployee?.name}
                                        required
                                        className="dark:bg-input dark:text-white"
                                    />
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="Email"
                                        defaultValue={editingEmployee?.email}
                                        required
                                        className="dark:bg-input dark:text-white"
                                    />
                                    <Input
                                        name="phone"
                                        placeholder="Phone"
                                        defaultValue={editingEmployee?.phone}
                                        required
                                        className="dark:bg-input dark:text-white"
                                    />
                                    <Button type="submit" className="w-full">
                                        {editingEmployee ? "Update" : "Add"} Employee
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mb-4">
                            <div className="relative w-80">
                                <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400 dark:text-gray-300" />
                                <Input
                                    placeholder="Search employees..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 dark:bg-input dark:text-white"
                                />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Total Employees: {employees.length}
                            </p>
                        </div>
                        <div className="rounded-md border dark:border-gray-700">
                            <Table>
                                <TableHeader>
                                    <TableRow className="dark:bg-card dark:text-gray-300">
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading
                                        ? Array.from({ length: 4 }).map((_, index) => (
                                              <TableRow key={index}>
                                                  <TableCell>
                                                      <Skeleton className="h-6 w-[250px]" />
                                                  </TableCell>
                                                  <TableCell>
                                                      <Skeleton className="h-6 w-[250px]" />
                                                  </TableCell>
                                                  <TableCell>
                                                      <Skeleton className="h-6 w-[150px]" />
                                                  </TableCell>
                                                  <TableCell className="text-right">
                                                      <div className="flex justify-end space-x-2">
                                                          <Skeleton className="h-9 w-9 rounded" />
                                                          <Skeleton className="h-9 w-9 rounded" />
                                                      </div>
                                                  </TableCell>
                                              </TableRow>
                                          ))
                                        : filteredEmployees.map((employee) => (
                                              <TableRow
                                                  key={employee.id}
                                                  className="hover:bg-gray-50 dark:hover:bg-muted transition-colors"
                                              >
                                                  <TableCell className="font-medium dark:text-white">
                                                      {employee.name}
                                                  </TableCell>
                                                  <TableCell className="dark:text-gray-300">
                                                      {employee.email}
                                                  </TableCell>
                                                  <TableCell className="dark:text-gray-300">
                                                      {employee.phone}
                                                  </TableCell>
                                                  <TableCell className="text-right">
                                                      <div className="flex justify-end space-x-2">
                                                          <Button
                                                              variant="outline"
                                                              size="icon"
                                                              onClick={() =>
                                                                  setEditingEmployee(employee)
                                                              }
                                                              className="dark:text-gray-300 dark:hover:text-white"
                                                          >
                                                              <Pencil className="h-4 w-4" />
                                                          </Button>
                                                          <Button
                                                              variant="outline"
                                                              size="icon"
                                                              onClick={() =>
                                                                  handleDelete(employee.id)
                                                              }
                                                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                          >
                                                              <Trash2 className="h-4 w-4" />
                                                          </Button>
                                                      </div>
                                                  </TableCell>
                                              </TableRow>
                                          ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
