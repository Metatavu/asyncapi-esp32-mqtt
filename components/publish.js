import { getSchemaType, renderFunction } from './common';

/**
 * Component for rendering publish channels
 * 
 * @param {string} channelName channel name
 * @param {object} component props
 * @returns rendered publish channels
 */
export function Publish({ channelName, channel, headerOnly }) {
  /**
   * Returns channel parameters as array
   * 
   * @param {array} parameters 
   * @returns channel parameters as array
   */
  const getChannelParameters = (parameters) => {
    return Object.entries(parameters).map(([name, parameter]) => {
      const { schema, description } = parameter._json;
      return { type: getSchemaType(schema), name: name, description: description };
    }); 
  };

  /**
   * Returns payload parameters as array
   * 
   * @param {array} parameters 
   * @returns payload parameters as array
   */
  const getPayloadParameters = (payload) => {
    const { _json } = payload;
    const type = _json['x-parser-schema-id'];
    const description = _json.description || 'body';
    return [{ type: type, name: 'body', description: description }];
  };

  /**
   * Renders topic
   * 
   * @param {array} channelParameters channel parameters
   * @returns topic
   */
  const renerTopic = (channelParameters) => {
    let result = channelName;
    channelParameters.forEach(channelParameter => {
      result = result.replace(`{${channelParameter.name}}`, `" + ${channelParameter.name} + "`);
    });

    return result;
  };

  /**
   * Renders function body
   * 
   * @param {array} channelParameters channel parameters
   * @param {array} payloadParameters payload parameters
   * @returns rendered function body
   */
  const renderBody = (channelParameters, payloadParameters) => {
    return `String topic = "/${renerTopic(channelParameters)}";
client.publish(topic, body.toJson());`;
  };

  const publish = channel.publish();
  const payload = publish.message().payload();
  const { operationId, description } = publish._json;
  const payloadParameters = getPayloadParameters(payload);
  const extraParameters = [{
    type: 'MQTTClient',
    name: 'client',
    description: 'MQTT Client'     
  }];

  const channelParametrs = getChannelParameters(channel.parameters());
  const parameters = [...extraParameters, ...channelParametrs, ...payloadParameters];

  return (
    <>      
      {
        renderFunction({
          body: renderBody(channelParametrs, payloadParameters),
          description: description, 
          name: operationId, 
          parameters: parameters, 
          returnType: 'void',
          headerOnly: headerOnly
        })
      }
    </>
  );
}
