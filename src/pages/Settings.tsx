import NavBar from "../components/Navbar";
import DoughnutChart from "../components/DoughnutChart";
export default function Settings() {
    return (
    <div className="background-image">
        <NavBar />
        <DoughnutChart wins={60} losses={40} />
    </div>)
}