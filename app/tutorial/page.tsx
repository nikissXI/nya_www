"use client";

const Page = () => {
  return (
    <div>
      <h1>tutorial 页面</h1>
    </div>
  );
};

export default Page;
const data = localStorage.getItem('userData');
if (data) {
  const parsedData = JSON.parse(data);
  console.log('Loaded data:', parsedData);
} else {
  console.log('No data found');
}