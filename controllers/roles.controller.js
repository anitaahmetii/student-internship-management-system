const roleService = require('../services/role.service');

const createRole = async (req, res) => 
{
    try
    {
        const { role, permission } = req.body
        const addRole = await roleService.add(role, permission);
        return res.status(201).json(addRole);
    }
    catch(err)
    {
        res.status(409).json(err.message);
        console.log(err.message);
    }
}
const getRoles = async (req, res) => 
{
    try 
    {
        const roles = await roleService.get();
        return res.status(200).json(roles);
    }
    catch(err)
    {
        res.status(err.status || 404).json(err.message);
        console.log(err.message);
    }
}
const updateRole = async (req, res) =>
{
    try
    {
        const { role } = req.params;
        const { role: roleName, permission } = req.body;

        const updateRole = await roleService.update(role, roleName, permission);
        return res.status(200).json(updateRole);
    }
    catch(err)
    {
        res.status(err.status || 404).json(err.message);
        console.log(err.message);
    }
}
const deleteRole = async (req, res) => 
{
    try
    {
        const { role } = req.params;
        await roleService.toDelete(role);
        return res.status(200).json("Role deleted successfully!");
    }
    catch(err)
    {
        res.status(err.status || 404).json(err.message);
        console.log(err.message);
    }
}

module.exports = { createRole, getRoles, updateRole, deleteRole };