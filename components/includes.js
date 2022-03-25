import { IndendedLine } from './indended-line';

/**
 * Renders api client includes 
 * 
 * @returns rendered api client includes
 */
export function Includes() {
  const includes = ['<vector>', '<string>', '<sstream>', '<iostream>', '<ArduinoJson.h>', '<MQTTClient.h>'];

  return includes.map(include =>
    <IndendedLine size={0}>{ `#include  ${include}` }</IndendedLine>
  );
}