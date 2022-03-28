import { getSchemaType, renderFunction } from './common';

/**
 * Component for rendering subscribe channels
 * 
 * @param {string} channelName channel name
 * @param {object} component props
 * @returns rendered subscribe channels
 */
export function Subscribe({ channelName, channel, headerOnly }) {
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
    return Object.entries(payload._json.properties).map(([name, parameter]) => {
      return { type: getSchemaType(parameter), name: name, description: parameter.description };
    });
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
   * Renders payload parameter as string
   * 
   * @param {object} parameter parameter
   * @returns rendered parameter
   */
  const renderPayloadParameter = (parameter) => {
    if (parameter.type === 'std::vector<std::string>') {
      return `JsonArray ${parameter.name}Array = payloadDocument["${parameter.name}"].to<JsonArray>();
std::vector<std::string> ${parameter.name} = std::vector<std::string>();
for (JsonVariant i : ${parameter.name}Array) {
  ${parameter.name}.push_back(i.as<std::string>());
}`;
    }

    return `${parameter.type} ${parameter.name} = payloadDocument["${parameter.name}"];`;
  };

  /**
   * Renders function body
   * 
   * @param {array} channelParameters channel parameters
   * @param {array} payloadParameters payload parameters
   * @returns rendered function body
   */
  const renderBody = (channelParameters, payloadParameters) => {
    return `/**String topic = "/${renerTopic(channelParameters)}";**/
DynamicJsonDocument payloadDocument(1024);
deserializeJson(payloadDocument, payload);
${payloadParameters.map(renderPayloadParameter).join('\n')}
subscribeCallback(${payloadParameters.map(payloadParameter => payloadParameter.name)});`;
  };

  /**
   * Renders callback parameters
   * 
   * @param {array} payloadParameters payload parameters
   * @returns callback parameters
   */
  const renderCallbackParameters = (payloadParameters) => {
    return payloadParameters.map(payloadParameter => {
      return `${payloadParameter.type} &${payloadParameter.name}`;
    }).join(', ');
  };
  
  const subscribe = channel.subscribe();
  const payload = subscribe.message().payload();
  const { operationId, description } = subscribe._json;
  const payloadParameters = getPayloadParameters(payload);
  const channelParametrs = getChannelParameters(channel.parameters());

  return (
    <>      
      {
        renderFunction({
          body: renderBody(channelParametrs, payloadParameters),
          description: description, 
          name: operationId, 
          parameters: [{
            type: 'String',
            name: 'payload',
            description: 'Received payload'
          }, {
            description: 'Callback function',
            name: 'subscribeCallback',
            raw: `void (*subscribeCallback)(${renderCallbackParameters(payloadParameters)})`
          }], 
          returnType: 'void',
          headerOnly: headerOnly
        })
      }
    </>
  );
}
