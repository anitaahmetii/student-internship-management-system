const Role = require('../models/Role');

const getStudentRole = async () =>
{
    const role = await Role.findOne({ role: 'student' }).lean();
    if (!role) { throw new Error('Student role not found'); }
    return role;
}
const getHrRole = async () =>
{
    const role = await Role.findOne({ role: 'hr' }).lean();
    if (!role) { throw new Error('HR role not found'); }
    return role;
}
const getAdminRole = async () =>
{
    const role = await Role.findOne({ role: 'admin' }).lean();
    if (!role) { throw new Error('Admin role not found'); }
    return role;
}
const getMentorRole = async () =>
{
    const role = await Role.findOne({ role: 'mentor' }).lean();
    if (!role) { throw new Error('Mentor role not found'); }
    return role;
}
module.exports = 
{ 
    getStudentRole, 
    getHrRole ,
    getAdminRole,
    getMentorRole
};