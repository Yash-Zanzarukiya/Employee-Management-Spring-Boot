package org.yashpz.em_project.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
  private Long id;
  private String name;
  private String email;
  private String phone;
}
