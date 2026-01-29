// components/admin/Grades/HeaderSection.tsx
interface HeaderSectionProps {
  title: string;
  description: string;
  onBack: () => void;
}

const HeaderSection = ({ title, description, onBack }: HeaderSectionProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
      <button
        onClick={onBack}
        className="text-blue-600 hover:underline"
      >
        ← Back
      </button>
    </div>
  );
};

export default HeaderSection;