/*
 *
 *    Copyright (c) 2022 Project CHIP Authors
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

const { asUpperCamelCase, asLowerCamelCase } = require('../../../../src/app/zap-templates/templates/app/helper.js');
const { isTestOnlyCluster } = require('../../../../src/app/zap-templates/common/simulated-clusters/SimulatedClusters.js');

function utf8StringLength(str)
{
  return new TextEncoder().encode(str).length
}

/*
 * Returns the name to use for accessing a given property of
 * a decodable type.
 *
 */
function asPropertyValue(options)
{
  let name = '';

  // The decodable type for simulated cluster is a struct by default, even if the
  // command just returns a single value.
  if (isTestOnlyCluster(this.parent.cluster)) {
    name = 'value.'
  }

  name += asLowerCamelCase(this.name);

  if (this.isOptional && !options.hash.dontUnwrapValue) {
    name += '.Value()';
  }

  return name;
}

async function asDecodableType()
{
  const options = { 'hash' : { ns : this.cluster } };
  let type;
  if ('commandObject' in this) {
    type = this.commandObject.responseName;
  } else if ('attributeObject' in this) {
    type            = this.attributeObject.type;
    this.isArray    = this.attributeObject.isArray;
    this.isOptional = this.attributeObject.isOptional;
    this.isNullable = this.attributeObject.isNullable;
  } else if ('eventObject' in this) {
    type = this.eventObject.type;
  } else {
    throw new Error("Unsupported decodable type");
  }

  if (isTestOnlyCluster(this.cluster)) {
    return `chip::app::Clusters::${asUpperCamelCase(this.cluster)}::Commands::${asUpperCamelCase(type)}::DecodableType`;
  }
}

//
// Module exports
//
exports.utf8StringLength = utf8StringLength;
exports.asPropertyValue  = asPropertyValue;
exports.asDecodableType  = asDecodableType;
