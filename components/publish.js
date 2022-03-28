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
    return Object.entries(payload._json.properties).map(([name, parameter]) => {
      return { type: getSchemaType(parameter), name: name, description: parameter.description };
    });
  };

  /**
   * Renders payload parameter as string
   * 
   * @param {object} parameter parameter
   * @returns rendered parameter
   */
  const renderPayloadParameter = (parameter) => {
    if (parameter.type === 'std::vector<std::string>') {
      return `JsonArray ${parameter.name}Array = payloadDocument.to<JsonArray>();
for (std::string i : ${parameter.name}) {
  ${parameter.name}Array.add(i);
};
payloadDocument["${parameter.name}"] = ${parameter.name}Array;
`;
    }

    return `payloadDocument["${parameter.name}"] = ${parameter.name};`;
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
StaticJsonDocument<200> payloadDocument;
${ payloadParameters.map(renderPayloadParameter).join('\n') }
char jsonBuffer[512];
serializeJson(payloadDocument, jsonBuffer);
Serial.println(jsonBuffer);
client.publish(topic, jsonBuffer);`;
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
