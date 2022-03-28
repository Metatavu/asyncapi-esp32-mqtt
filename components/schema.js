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
function SchemaObject({ schemaName, schema }) {
  const json = schema.json();
  const className = _.upperFirst(_.camelCase(schemaName));
  const { properties } =  json; // required, 

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
   * Renders toJson method
   * 
   * @returns toJson method
   */
  const renderToJson = () => {
    const exportProperties = Object.keys(properties).map(propertyName => {
      const exportProperty = properties[propertyName];

      if (exportProperty.type === 'array') {
        const exportItemType = getPrimitiveType(exportProperty.items.type);
        return (
          <>
            <IndendedLine size={ 4 }>{ `JsonArray ${propertyName}Array = doc.to<JsonArray>();` }</IndendedLine>
            <IndendedLine size={ 4 }>{ `for(${exportItemType} i : ${propertyName}) ${propertyName}Array.add(i);` }</IndendedLine>
            <IndendedLine size={ 4 }>{ `doc["${propertyName}"] = ${propertyName}Array;` }</IndendedLine>
          </>
        );
      }
      return ( 
        <IndendedLine size={ 4 }>{ `doc["${propertyName}"] = ${propertyName};` }</IndendedLine>
      );
    });

    return (
      <>
        <IndendedLine size={ 2 }>{ 'String toJson() {' }</IndendedLine>
        <IndendedLine size={ 4 }>{ 'StaticJsonDocument<1024> doc;' }</IndendedLine>
        { exportProperties }
        <IndendedLine size={ 4 }>{ 'char jsonBuffer[1024];' }</IndendedLine>
        <IndendedLine size={ 4 }>{ 'serializeJson(doc, jsonBuffer);' }</IndendedLine>
        <IndendedLine size={ 4 }>{ 'return jsonBuffer;' }</IndendedLine>
        <IndendedLine size={ 2 }>{ '}' }</IndendedLine>
      </>
    );
  };

  return (
    <>
      <IndendedLine size={ 0 }> { `class ${className} { ` } </IndendedLine>
      <IndendedLine size={ 2 }> { 'public:' } </IndendedLine>      
      { Object.keys(properties).map(propertyName  => renderProperty(propertyName, properties[propertyName])) }
      <IndendedLine size={ 2 }> { renderToJson() } </IndendedLine>
      <IndendedLine size={ 0 }> { '}; ' } </IndendedLine>
    </>
  );
}

/**
 * Renders string property
 * 
 * @param {object} props component props
 * @returns rendered string property
 */
function SchemaString({ schemaName, schema }) {
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
export function Schema({ schemaName, schema }) {
  const json = schema.json();
  
  switch (json.type) {
  case 'object':
    return <SchemaObject schemaName={ schemaName } schema={ schema }/>;
  case 'string':
    return <SchemaString schemaName={ schemaName } schema={ schema }/>;
  default:
    console.error(`Unsupported schema type ${json.type}`);
  }
}