var member = ['csjang', 'egonig', 'eykim'];
console.log(member);

for(var no in member){
    console.log(member[no]);
}
console.log('----------------------------------------');
var roles = {
    programmer:'csjang',
    teacher:'egoing',
    wife:'eykim'
};
console.log(roles);
console.log(roles.wife);

for(var name in roles) {
    console.log('object => ', name, 'roles => ', roles[name]);
}
