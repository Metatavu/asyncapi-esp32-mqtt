import { File } from '@asyncapi/generator-react-sdk';
import { ApiClient } from '../components/api-client';
import { ApiClientHeader } from '../components/api-client-header';
import _ from 'lodash';

export default function({ asyncapi, params }) {
  if (!asyncapi.hasComponents()) {
    return null;
  }

  const apiName = asyncapi.info().title();
  return (
    [
      <File name={ `${_.snakeCase(apiName)}.h` }>
        <ApiClientHeader asyncapi={ asyncapi } />
      </File>,
      <File name={ `${_.snakeCase(apiName)}.cpp` }>
        <ApiClient asyncapi={ asyncapi } />
      </File>
    ]
  );
}
