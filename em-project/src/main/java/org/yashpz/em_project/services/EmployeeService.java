package org.yashpz.em_project.services;

import java.util.List;

import org.yashpz.em_project.models.Employee;

public interface EmployeeService {

  String addEmployee(Employee employee);

  List<Employee> getEmployees();

  Employee getEmployee(Long id);

  boolean deleteEmployee(Long id);

  String updateEmployee(Long id, Employee employee);

}
