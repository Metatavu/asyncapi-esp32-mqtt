import { File } from '@asyncapi/generator-react-sdk';
import { ApiClient } from '../components/api-client';
import { ApiClientHeader } from '../components/api-client-header';
import { Schemas } from '../components/schemas';
import _ from 'lodash';

export default function({ asyncapi, params }) {
  if (!asyncapi.hasComponents()) {
    return null;
  }

  const includeModel = true;
  const includeApi = false;

  const apiName = asyncapi.info().title();
  const results = [];

  if (includeModel) {
    results.push((
      <File name={ 'model.cpp' }>
        <Schemas asyncapi={ asyncapi } />
      </File>
    ));
  }

  if (includeApi) {
    results.push((
      <File name={ `${_.snakeCase(apiName)}.h` }>
        <ApiClientHeader asyncapi={ asyncapi } />
      </File>
    ));

    results.push((
      <File name={ `${_.snakeCase(apiName)}.cpp` }>
        <ApiClient asyncapi={ asyncapi } />
      </File>
    ));
  }

  return results;
}
