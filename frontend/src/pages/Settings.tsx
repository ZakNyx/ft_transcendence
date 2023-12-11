import SettingForm from "../components/SettingForm";
import { InitSocket } from "./variables";

export default function Settings() {
  InitSocket();
  return (
    <div className="h-screen no-scroll">
      <SettingForm />
    </div>
  );
}
