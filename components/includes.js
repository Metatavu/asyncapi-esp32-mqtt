import { IndendedLine } from './indended-line';

/**
 * Renders api client includes 
 * 
 * @param props component properties
 * @returns rendered api client includes
 */
export function Includes({ includes }) {
  return includes.map(include =>
    <IndendedLine size={0}>{ `#include ${include}` }</IndendedLine>
  );
}