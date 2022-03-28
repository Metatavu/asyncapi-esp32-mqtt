/* eslint-disable security/detect-object-injection */
import { IndendedLine } from './indended-line';
import _ from 'lodash';
import { getSchemaType } from './common';

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

  return (
    <>
      <IndendedLine size={ 0 }> { `class ${className} { ` } </IndendedLine>
      <IndendedLine size={ 2 }> { 'public:' } </IndendedLine>      
      { Object.keys(properties).map(propertyName  => renderProperty(propertyName, properties[propertyName])) }
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