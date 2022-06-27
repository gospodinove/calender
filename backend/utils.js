module.exports.replaceId = function (entity) {
  entity.id = entity._id
  delete entity._id
  return entity
}
