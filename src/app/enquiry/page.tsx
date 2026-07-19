'use client';
import EnquiryForm from '@/components/EnquiryForm';

export default function EnquiryPage() {
  return (
    <div className="container-x py-16 flex justify-center min-h-[70vh]">
      <div className="w-full max-w-2xl relative">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-secondary opacity-10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl -z-10"></div>
        <EnquiryForm destinationName="General" packageName="General Enquiry" />
      </div>
    </div>
  );
}
