import { File } from '@asyncapi/generator-react-sdk';
import { ApiClient } from '../components/api-client';
import { ApiClientHeader } from '../components/api-client-header';
import { Schemas } from '../components/schemas';

export default function({ asyncapi, params }) {
  if (!asyncapi.hasComponents()) {
    return null;
  }

  const includeSubscribe = false;
  const includePublish = true;
  const includeModel = true;
  const includeApi = includeSubscribe || includePublish;

  const clientFilename = 'client';
  const modelsFilename = 'models';
  const results = [];

  if (includeModel) {
    results.push((
      <File name={ `${modelsFilename}.cpp` }>
        <Schemas asyncapi={ asyncapi } headerOnly={ false } modelsFilename={ modelsFilename }/>
      </File>
    ));
    results.push((
      <File name={ `${modelsFilename}.hpp` }>
        <Schemas asyncapi={ asyncapi } headerOnly={ true }/>
      </File>
    ));
  }

  if (includeApi) {
    results.push((
      <File name={ `${clientFilename}.hpp` }>
        <ApiClientHeader asyncapi={ asyncapi } includeSubscribe={ includeSubscribe } includePublish={ includePublish }/>
      </File>
    ));

    results.push((
      <File name={ `${clientFilename}.cpp` }>
        <ApiClient asyncapi={ asyncapi } includeSubscribe={ includeSubscribe } includePublish={ includePublish } modelsFilename={ modelsFilename }/>
      </File>
    ));
  }

  return results;
}
