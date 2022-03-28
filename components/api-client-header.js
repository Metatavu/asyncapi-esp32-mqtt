import { ListPublish } from './list-publish';
import { ListSubscribe } from './list-subscribe';
import { Includes } from './includes';
import { IndendedLine } from './indended-line';

/**
 * Renders api client header file contents
 * 
 * @param {object} component props
 * @returns rendered api client header file contents
 */
export function ApiClientHeader({ asyncapi, includeSubscribe, includePublish, modelsFilename }) {
  const channels = asyncapi.channels();
  const includes = [`"${modelsFilename}.hpp"`];

  return (
    <>
      <IndendedLine size={0}>{ '#pragma once' }</IndendedLine>
      <Includes includes={ includes }/>
      { includeSubscribe ? <ListSubscribe channels={channels} headerOnly={ true }/> : null }
      { includePublish ? <ListPublish channels={channels} headerOnly={ true }/> : null }
    </>
  );
}