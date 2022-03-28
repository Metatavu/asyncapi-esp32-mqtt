import { ListPublish } from './list-publish';
import { ListSubscribe } from './list-subscribe';

/**
 * Renders api client header file contents
 * 
 * @param {object} component props
 * @returns rendered api client header file contents
 */
export function ApiClientHeader({ asyncapi, includeSubscribe, includePublish }) {
  const channels = asyncapi.channels();

  return (
    <>
      { includeSubscribe ? <ListSubscribe channels={channels} headerOnly={ true }/> : null }
      { includePublish ? <ListPublish channels={channels} headerOnly={ true }/> : null }
    </>
  );
}