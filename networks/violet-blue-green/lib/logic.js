/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
// the following line removes the eslint warnings for the globally available functions

/* global getAssetRegistry getFactory getCurrentParticipant*/

/**
 * Sample transaction processor function.
 * @param {org.composer.game.GameResult} tx The sample transaction instance.
 * @transaction
 */
async function GameResult(tx) {  // eslint-disable-line no-unused-vars

    // Get the asset registry for the asset.
    let gameRegistry = await getAssetRegistry('org.composer.game.Game');

    // note the new asset is being created with an indentifier of the transaction
    let gameresult = getFactory().newResource('org.composer.game','Game',tx.getIdentifier());
    gameresult.player = getCurrentParticipant();
    gameresult.result = tx.result;
    gameresult.timestamp = tx.getTimestamp();

    // Update the asset in the asset registry.
    await gameRegistry.add(gameresult);
}
