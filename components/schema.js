/* eslint-disable security/detect-object-injection */
import { IndendedLine } from './indended-line';
import _ from 'lodash';
import { getSchemaType, getPrimitiveType } from './common';

/**
 * Renders schema object
 * 
 * @param {object} props component props
 * @returns schema object
 */
function SchemaObject({ schemaName, schema, headerOnly }) {
  const json = schema.json();
  const className = _.upperFirst(_.camelCase(schemaName));
  const { properties } = json;

  /**
   * Renders single property
   * 
   * @param {string} propertyName 
   * @param {object} property 
   * @returns single property
   */
  const renderProperty = (propertyName, property) => {
    const type = getSchemaType(property);

    return (
      <>
        <IndendedLine size={ 4 }>{ `${type} ${propertyName};`}</IndendedLine>
      </>
    );
  };

  /**
   * Renders construtor
   * 
   * @returns construtor
   */
  const renderConstructor = (headerOnly) => {
    const construtorArguments = Object.keys(properties).map(propertyName => {
      const construtorProperty = properties[propertyName];
      const construtorType = getSchemaType(construtorProperty);
      return `${construtorType} ${propertyName}`;
    });

    const construtorSetters = Object.keys(properties).map(propertyName => {
      return `this->${propertyName} = ${propertyName};`;
    });

    if (headerOnly) {
      return (
        <>
          <IndendedLine size={ 4 }>{ `${className}(${construtorArguments.join(' ')});` }</IndendedLine>
        </>
      );
    }

    return (
      <>
        <IndendedLine size={ 0 }>{ `${className}::${className}(${construtorArguments.join(' ')}) {` }</IndendedLine>
        <IndendedLine size={ 2 }>{ `${construtorSetters}` }</IndendedLine>
        <IndendedLine size={ 0 }>{ '}' }</IndendedLine>
        <IndendedLine size={ 0 }></IndendedLine>
      </>
    );
  };

  /**
   * Renders from JSON function
   * 
   * @returns from JSON function
   */
  const renderFromJson = (headerOnly) => {
    const constructorArguments = Object.keys(properties).map(argument => `${argument}Param`);

    const assignRows = Object.keys(properties).map(propertyName => {
      const assignProperty = properties[propertyName];
      const assignType = getSchemaType(assignProperty);

      if (assignProperty.type === 'array') {
        const assignItemType = getPrimitiveType(assignProperty.items.type);

        return (
          <>
            <IndendedLine size={ 0 }>{ `JsonArray ${propertyName}Array = doc["${propertyName}"];` }</IndendedLine>
            <IndendedLine size={ 0 }>{ `std::vector<${assignItemType}> ${propertyName}Param = std::vector<${assignItemType}>();` }</IndendedLine>
            <IndendedLine size={ 0 }>{ `for (JsonVariant v : ${propertyName}Array) ${propertyName}Param.push_back(v.as<${assignItemType}>());` }</IndendedLine>
          </>
        );
      }

      return (
        <IndendedLine size={ 0 }> { `${assignType} ${propertyName}Param = doc["${propertyName}"];` } </IndendedLine>
      );
    });

    if (headerOnly) {
      return (
        <>
          <IndendedLine size={ 4 }>{ `static ${className} fromJson(String json);` }</IndendedLine>
        </>
      );
    }

    return (
      <>
        <IndendedLine size={ 0 }>{ `${className} ${className}::fromJson(String json) {` }</IndendedLine>
        <IndendedLine size={ 2 }>{ 'StaticJsonDocument<4096> doc;' }</IndendedLine>
        <IndendedLine size={ 2 }>{ 'deserializeJson(doc, json);' }</IndendedLine>
        <IndendedLine size={ 2 }>{ assignRows }</IndendedLine>
        <IndendedLine size={ 2 }>{ `return ${className}(${constructorArguments});` }</IndendedLine>
        <IndendedLine size={ 0 }>{ '}' }</IndendedLine>
        <IndendedLine size={ 0 }></IndendedLine>
      </>
    );
  };

  /**
   * Renders toJson method
   * 
   * @returns toJson method
   */
  const renderToJson = (headerOnly) => {
    const exportProperties = Object.keys(properties).map(propertyName => {
      const exportProperty = properties[propertyName];

      if (exportProperty.type === 'array') {
        const exportItemType = getPrimitiveType(exportProperty.items.type);
        return (
          <>
            <IndendedLine size={ 2 }>{ `JsonArray ${propertyName}Array = doc.to<JsonArray>();` }</IndendedLine>
            <IndendedLine size={ 2 }>{ `for(${exportItemType} i : ${propertyName}) ${propertyName}Array.add(i);` }</IndendedLine>
            <IndendedLine size={ 2 }>{ `doc["${propertyName}"] = ${propertyName}Array;` }</IndendedLine>
          </>
        );
      }
      return ( 
        <IndendedLine size={ 2 }>{ `doc["${propertyName}"] = ${propertyName};` }</IndendedLine>
      );
    });

    if (headerOnly) {
      return (
        <>
          <IndendedLine size={ 2 }>{ 'String toJson();' }</IndendedLine>
        </>
      );
    }

    return (
      <>
        <IndendedLine size={ 0 }>{ `String ${className}::toJson() {` }</IndendedLine>
        <IndendedLine size={ 2 }>{ 'StaticJsonDocument<1024> doc;' }</IndendedLine>
        { exportProperties }
        <IndendedLine size={ 2 }>{ 'char jsonBuffer[1024];' }</IndendedLine>
        <IndendedLine size={ 2 }>{ 'serializeJson(doc, jsonBuffer);' }</IndendedLine>
        <IndendedLine size={ 2 }>{ 'return jsonBuffer;' }</IndendedLine>
        <IndendedLine size={ 0 }>{ '}' }</IndendedLine>
      </>
    );
  };

  if (headerOnly) {
    return (
      <>
        <IndendedLine size={ 0 }> { `class ${className} { ` } </IndendedLine>
        <IndendedLine size={ 2 }> { 'public:' } </IndendedLine>
        { Object.keys(properties).map(propertyName  => renderProperty(propertyName, properties[propertyName])) }
        <IndendedLine size={ 0 }></IndendedLine>
        { renderConstructor(headerOnly) }
        { renderFromJson(headerOnly) }
        <IndendedLine size={ 2 }> { renderToJson(headerOnly) } </IndendedLine>
        <IndendedLine size={ 0 }> { '}; ' } </IndendedLine>
      </>
    );
  }

  return (
    <>
      <IndendedLine size={ 0 }></IndendedLine>
      { renderConstructor(headerOnly) }
      { renderFromJson(headerOnly) }
      <IndendedLine size={ 0 }> { renderToJson(headerOnly) } </IndendedLine>
    </>
  );
}

/**
 * Renders string property
 * 
 * @param {object} props component props
 * @returns rendered string property
 */
function SchemaString({ schemaName, schema, headerOnly }) {
  if (!headerOnly) {
    return null;
  }

  const typeName = _.upperFirst(_.camelCase(schemaName));
  return (
    <IndendedLine size={ 0 }> { `typedef String ${typeName};` } </IndendedLine>
  );
}

/**
 * Renders schema
 * 
 * @param {object} props component props
 * @returns rendered schema
 */
export function Schema({ schemaName, schema, headerOnly }) {
  const json = schema.json();
  
  switch (json.type) {
  case 'object':
    return <SchemaObject schemaName={ schemaName } schema={ schema } headerOnly={ headerOnly }/>;
  case 'string':
    return <SchemaString schemaName={ schemaName } schema={ schema } headerOnly={ headerOnly }/>;
  default:
    console.error(`Unsupported schema type ${json.type}`);
  }
}