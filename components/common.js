import { IndendedLine } from './indended-line';

/**
 * Renders function
 * 
 * @param {object} options
 * @returns rendered function
 */
export const renderFunction = ({ description, name, body, parameters, returnType, headerOnly }) => {
  const header = `${returnType} ${name}(${ parameters.map((parameter) => parameter.raw ? parameter.raw : `${ parameter.type } ${ parameter.name }`).join(', ') })`;

  if (headerOnly) {
    return (
      <IndendedLine size={0}>{ `${header};` }</IndendedLine>
    );
  }

  const parameterDocs = parameters.map(parameter => {
    return (
      <IndendedLine size={2}>{ `@param ${parameter.name} ${parameter.description}` }</IndendedLine>
    );
  });

  return (
    <>
      <IndendedLine size={0}>{ '' }</IndendedLine>
      <IndendedLine size={0}>{ '/**' }</IndendedLine>
      <IndendedLine size={2}>{ description }</IndendedLine>
      <IndendedLine size={0}>{ '' }</IndendedLine>
      { parameterDocs }
      <IndendedLine size={0}>{ '**/' }</IndendedLine>
      <IndendedLine size={0}>{ ` ${header} { ` }</IndendedLine>
      <IndendedLine size={2}>{ body }</IndendedLine>
      <IndendedLine size={0}>{ '}' }</IndendedLine>
    </>
  );
};

/**
 * Returns c++ type for given AsyncApi type
 * 
 * @param {string} type type
 * @returns c++ type
 */
export const getPrimitiveType = (type) => {
  switch (type) {
  case 'integer':
    return 'int';
  case 'number':
    return 'double';
  case 'boolean':
    return 'bool';
  case 'object':
    return '';
  case 'string':
    return 'String';
  }
};

/**
 * Returns type for given schema
 * 
 * @param {object} schema 
 * @returns type for given schema
 */
export const getSchemaType = (schema) => {
  const primitiveTypes = ['integer', 'number', 'boolean', 'object', 'string'];

  const { type } = schema;

  if (primitiveTypes.includes(type)) {
    return getPrimitiveType(type);
  }

  if (type === 'array') {
    const itemsType = getPrimitiveType(schema.items.type);
    return `std::vector<${itemsType}>`;
  }

  return type;
};