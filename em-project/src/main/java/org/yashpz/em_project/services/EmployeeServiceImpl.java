package org.yashpz.em_project.services;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.yashpz.em_project.entities.EmployeeEntity;
import org.yashpz.em_project.models.Employee;
import org.yashpz.em_project.repositories.EmployeeRepository;

import java.util.ArrayList;

@Service
public class EmployeeServiceImpl implements EmployeeService {

  @Autowired
  private EmployeeRepository employeeRepository;

  @Override
  public String addEmployee(Employee employee) {
    EmployeeEntity employeeEntity = new EmployeeEntity();
    BeanUtils.copyProperties(employee, employeeEntity);
    employeeRepository.save(employeeEntity);
    return "Employee Saved Successfully";
  }

  @Override
  public List<Employee> getEmployees() {
    List<EmployeeEntity> employeeEntities = employeeRepository.findAll();
    List<Employee> employees = new ArrayList<Employee>();
    for (EmployeeEntity employeeEntity : employeeEntities) {
      Employee employee = new Employee();
      BeanUtils.copyProperties(employeeEntity, employee);
      employees.add(employee);
    }
    return employees;
  }

  @Override
  public Employee getEmployee(Long id) {
    EmployeeEntity employeeEntity = employeeRepository.findById(id).get();
    if (employeeEntity != null) {
      Employee employee = new Employee();
      BeanUtils.copyProperties(employeeEntity, employee);
      return employee;
    }
    return null;
  }

  @Override
  public boolean deleteEmployee(Long id) {
    EmployeeEntity employeeEntity = employeeRepository.findById(id).get();
    if (employeeEntity != null) {
      employeeRepository.delete(employeeEntity);
      return true;
    }
    return false;
  }

  @Override
  public String updateEmployee(Long id, Employee employee) {
    EmployeeEntity employeeEntity = employeeRepository.findById(id).get();
    if (employeeEntity != null) {
      BeanUtils.copyProperties(employee, employeeEntity, "id");
      employeeRepository.save(employeeEntity);
      return "Employee Updated Successfully";
    }
    return "Employee Not Found";
  }

}
