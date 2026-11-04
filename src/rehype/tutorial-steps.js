// Splits the "N. " off tutorial step headings so the number can be styled. Heading ids and
// TOC labels are set earlier in the pipeline, so anchors like #1-prepare-the-tools survive.
const STEP = /^(\d+)\.\s+/;

export default function tutorialSteps() {
  return (tree) => {
    for (const node of tree.children) {
      if (node.type !== 'element' || node.tagName !== 'h2') continue;
      const first = node.children[0];
      const m = first?.type === 'text' && first.value.match(STEP);
      if (!m) continue;
      first.value = first.value.slice(m[0].length);
      node.properties.className = [...(node.properties.className || []), 'step'];
      node.children.unshift(
        {type: 'element', tagName: 'span', properties: {className: ['step-n'], ariaHidden: 'true'}, children: [{type: 'text', value: m[1]}]},
        {type: 'element', tagName: 'span', properties: {className: ['sr-only']}, children: [{type: 'text', value: `Step ${m[1]}: `}]},
      );
    }
  };
}
