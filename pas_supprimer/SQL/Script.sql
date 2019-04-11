UPDATE City JOIN Department ON City.department_code = Department.code SET  City.Department_id = Department.code;

ALTER TABLE City DROP COLUMN department_code;

UPDATE School JOIN City ON School.city = City.name SET  School.City_id = City.name;

ALTER TABLE School DROP COLUMN city;