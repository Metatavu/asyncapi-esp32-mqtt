import { Includes } from './includes';
import { Schema } from './schema';

/**
 * Renders schemas file contents
 * 
 * @param {object} component props
 * @returns rendered schemas file contents
 */
export function Schemas({ asyncapi }) {
  const schemas = asyncapi.allSchemas();
  const includes = ['<vector>', '<string>', '<sstream>', '<iostream>', '<ArduinoJson.h>'];

  return (
    <>
      <Includes includes={ includes }/>
      { Array.from(schemas).map(([schemaName, schema]) => {
        return (
          <Schema schemaName={ schemaName } schema={ schema }/>
        );        
      }) }
    </>
  );
}