export default function SettingForm() {
  return (
    <div className="">
      <div className="">
        <span>Profile Picture</span>
        <img
          src="../../public/images/zihirri.jpg"
          alt="profile image"
          className="w-16 h-16 sm:w-24 sm:h-24 lg:w-40 lg:h-40 object-contain rounded-full mr-3 sm:mr-4 lg:mr-6 ml-1 sm:ml-2 lg:ml-4"
        />
        <span>JPG or PNG no larger than 5 MB</span>
        <div>
          <input type="file" id="profilepic" className="text-xl" />
        </div>
      </div>
    </div>
  );
}
