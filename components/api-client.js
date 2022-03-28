import { ListPublish } from './list-publish';
import { ListSubscribe } from './list-subscribe';
import { Includes } from './includes';

/**
 * Renders api client file contents
 * 
 * @param {object} component props
 * @returns rendered api client file contents
 */
export function ApiClient({ asyncapi, includeSubscribe, includePublish, modelsFilename }) {
  const channels = asyncapi.channels();
  const includes = ['<vector>', '<string>', '<sstream>', '<iostream>', '<ArduinoJson.h>', '<MQTTClient.h>', `"${modelsFilename}.hpp"`];

  return (
    <>
      <Includes includes={ includes }/>
      { includeSubscribe ? <ListSubscribe channels={channels} headerOnly={ false }/> : null }
      { includePublish ? <ListPublish channels={channels} headerOnly={ false }/> : null }
    </>
  );
}