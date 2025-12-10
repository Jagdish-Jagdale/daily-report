import ReportForm from '../components/ReportForm';

const ReportFormPage = () => {
  return (
    <div className="flex-1 min-h-screen overflow-y-auto bg-black text-white">
      <div className="px-8 py-6 max-w-full">
        <ReportForm />
      </div>
    </div>
  );
};

export default ReportFormPage;
