
import { Indent, IndentationTypes } from '@asyncapi/generator-react-sdk';

/**
 * Renders line with given indent
 * 
 * @param {object} component props
 * @returns rendered line with indent
 */
export function IndendedLine({ size, children }) {
  return (
    <>
      <Indent size={ size } type={ IndentationTypes.SPACES }>{ children }</Indent>
      { '\n' }
    </>
  );
}