module.exports.replace_id = function (entity) {
  entity.id = entity._id
  delete entity._id
  return entity
}
