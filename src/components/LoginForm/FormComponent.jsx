import LoginForm from "./LoginForm";
import CompanyRegisterForm from "./CompanyRegisterForm";
import EmployeeRegisterForm from "./EmployeeRegisterForm";

export default function FormComponent({ selected }) {
    switch (selected) {
        case "login":
            return <LoginForm />;
        case "companyRegister":
            return <CompanyRegisterForm />;
        case "employeeRegister":
            return <EmployeeRegisterForm />;
        default:
            return null;
    }
}