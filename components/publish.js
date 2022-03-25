import { getType, renderFunction } from './common';

/**
 * Component for rendering publish channels
 * 
 * @param {object} component props
 * @returns rendered publish channels
 */
export function Publish({ channel, headerOnly }) {
  /**
   * Returns channel parameters as array
   * 
   * @param {array} parameters 
   * @returns channel parameters as array
   */
  const getChannelParameters = (parameters) => {
    return Object.entries(parameters).map(([name, parameter]) => {
      const { schema, description } = parameter._json;
      return { type: getType(schema.type), name: name, description: description };
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
      return { type: getType(parameter.type), name: name, description: parameter.description };
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
   * Renders function body
   * 
   * @param {array} payloadParameters payload parameters
   * @returns rendered function body
   */
  const renderBody = (payloadParameters) => {
    return `String topic = "/gfgh";
StaticJsonDocument<200> payloadDocument;
${ payloadParameters.map(renderPayloadParameter) }
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
          body: renderBody(payloadParameters),
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
