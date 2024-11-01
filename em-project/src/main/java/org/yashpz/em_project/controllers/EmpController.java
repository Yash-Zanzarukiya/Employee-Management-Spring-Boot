package org.yashpz.em_project.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.yashpz.em_project.models.Employee;
import org.yashpz.em_project.services.EmployeeService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1/")
public class EmpController {

  @Autowired
  EmployeeService employeeService;

  @GetMapping("employee")
  public List<Employee> getEmployees() {
    return employeeService.getEmployees();
  }

  @GetMapping("employee/{id}")
  public Employee getEmployee(@PathVariable Long id) {
    return employeeService.getEmployee(id);
  }

  @PostMapping("employee")
  public String AddEmployee(@RequestBody Employee employee) {
    return employeeService.addEmployee(employee);
  }

  @PatchMapping("employee/{id}")
  public String updateEmployee(@PathVariable Long id, @RequestBody Employee employee) {
    return employeeService.updateEmployee(id, employee);
  }

  @DeleteMapping("employee/{id}")
  public String deleteEmployee(@PathVariable Long id) {
    if (employeeService.deleteEmployee(id))
      return "Employee deleted successfully";

    return "Employee Not Found";
  }

}
