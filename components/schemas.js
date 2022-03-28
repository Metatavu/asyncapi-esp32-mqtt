import { Includes } from './includes';
import { Schema } from './schema';
import { IndendedLine } from './indended-line';

/**
 * Renders schemas file contents
 * 
 * @param {object} component props
 * @returns rendered schemas file contents
 */
export function Schemas({ asyncapi, headerOnly, modelsFilename }) {
  const schemas = asyncapi.allSchemas();
  const includes = ['<vector>', '<string>', '<sstream>', '<iostream>', '<ArduinoJson.h>', `"${modelsFilename}.hpp"`];

  return (
    <>
      { headerOnly ? null : <Includes includes={ includes }/> }
      { Array.from(schemas).map(([schemaName, schema]) => {
        return (
          <>
            <IndendedLine size={ 0 }></IndendedLine>
            <Schema schemaName={ schemaName } schema={ schema } headerOnly={ headerOnly }/>
          </>
        );        
      }) }
    </>
  );
}