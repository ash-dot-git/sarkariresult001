import ImportantLinksSection from './ImportantLinksSection';
import TableSection from './TableSection';
import InfoSection from './InfoSection';
import DetailsSection from './DetailsSection';

const hasLinks = (section) => {
  return section.elements.some(el => el.type === 'field' && el.fieldType === 'key_value_pair');
};

const hasTables = (section) => {
  return section.elements.some(el => el.type === 'table');
};

export default function SectionDispatcher({ section }) {
  if (hasLinks(section)) {
    return <ImportantLinksSection section={section} />;
  }

  if (hasTables(section)) {
    return <TableSection section={section} />;
  }

  // Fallback to InfoSection for general content
  return <InfoSection section={section} />;
}