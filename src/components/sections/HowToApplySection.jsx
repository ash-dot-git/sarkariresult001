import ColorMarkdownRenderer from '../ui/ColorMarkdownRenderer';

const HowToApplySection = ({ elements }) => {
  if (!Array.isArray(elements)) {
    return null;
  }

  const howToApply = elements.find(el => el.name === 'how_to_apply');

  if (!howToApply || !howToApply.value) {
    return null;
  }

  return (
    <section className="my-6">
      <h2 className="text-2xl font-bold mb-4">How to Apply</h2>
      <div className="prose max-w-none">
        <ColorMarkdownRenderer content={howToApply.value} />
      </div>
    </section>
  );
};

export default HowToApplySection;