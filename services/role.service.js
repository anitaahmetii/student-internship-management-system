const Role = require('../models/Role');

const add = async (roleName, permission) =>
{
    try
    {
        const findRole = await roleExists(roleName);
        if (findRole.exists) throw new Error(`Role already exists!`);

        const role = new Role({ role: roleName, permission: permission });
        return await role.save();
    }
    catch(err)
    {
        throw new Error(`Database error while creating role: ${err.message}`);
    }
}
const roleExists = async (roleName) =>
{
    const findRole = await Role.findOne({ role: roleName });
    return { exists: !!findRole, id: findRole?._id };
}
const get = async () => 
{
    const roles = await Role.find({});
    if (roles.length === 0) throw new Error("No roles found!");
    return roles;
}
const update = async (role, roleName, permission) =>
{
    try
    {
        const findRole = await roleExists(role);
        if (!findRole.exists) throw new Error(`Role not found!`);

        const update = await Role.findOneAndUpdate( { role: role }, 
                                                    { role: roleName, permission: permission }, 
                                                    { new: true, runValidators: true });
        return update;
    }
    catch(err)
    {
        throw new Error(`Database error while updating role: ${err.message}`)
    }
}
const toDelete = async (roleName) => 
{
    try
    {
        const findRole = await roleExists(roleName);
        if (!findRole) throw new Error(`Role not found!`);

        const roleToDelete = await Role.findOneAndDelete({ role: roleName }, { new: true });
        return roleToDelete;
    }
    catch(err)
    {
        throw new Error(`Database error while deleting role: ${err.message}`)
    }
}

module.exports = { add, get, update, toDelete };