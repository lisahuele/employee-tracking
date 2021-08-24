INSERT INTO departments (name)
VALUES 
    ('Sales'),
    ('Legal'),
    ('Finance'),
    ('Engineer');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Sales Rep', '40000', '1'),
    ('Sales Lead', '50000', '1'),
    ('Sales Manager', '100000', '1'),

    ('Lawyer', '80000', '2'),
    ('Legal Team Lead', '120000', '2'),

    ('Accountant', '60000', '3'),
    ('Financial Analyst', '80000', '3'),
    ('Finance Manager', '100000', '3'),

    ('Jr. Software Engineer', '60000', '4'),
    ('Software Engineer', '80000', '4'),
    ('Engineer Manager', '100000', '4');

INSERT INTO employees (first_name, last_name, manager_id, role_id)
VALUES 
    ('Ronald', 'Firbank', null, '3'),
    ('Virginia', 'Woolf', null, '5'),
    ('Piers', 'Gaveston', null, '8'),
    ('Charles', 'LeRoi', null, '11'),
    ('Katherine', 'Mansfield', '1', '1'),
    ('Dora', 'Carrington', '1', '2'),
    ('Edward', 'Bellamy', '2', '4'),
    ('Montague', 'Summers', '3', '7'),
    ('Octavia', 'Butler', '3', '6'),
    ('Unica', 'Zurn', '4', '10'),
    ('James', 'Fraser', '4', '9');

