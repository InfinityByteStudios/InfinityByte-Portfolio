import { init, getMembers } from './handler.js';
import { saveTodayAttendance, createAttendanceChart, updateAttendanceChart } from './attendance.js';

const expiresSoonContainer = document.getElementById('expiresSoonContainer');
const allCount = document.getElementById('allCount');
const activeCount = document.getElementById('activeCount');
const expiresSoonCount = document.getElementById('expiresSoonCount');
const expiredCount = document.getElementById('expiredCount');
const attendedCount = document.getElementById('attendedCount');
const absenceCount = document.getElementById('absenceCount');
const chart = 'attendanceChart';

let members;

async function loadMembers() {
  try {
    allCount.textContent = 'Loading';
    activeCount.textContent = 'Loading';
    expiresSoonCount.textContent = 'Loading';
    expiredCount.textContent = 'Loading';
    attendedCount.textContent = 'Loading';
    absenceCount.textContent = 'Loading';
    
    expiresSoonContainer.innerHTML = '';
    
    const memberData = await getMembers();
    
    if (memberData?.error) throw new Error(memberData.error);
    
    allCount.textContent = memberData.membersCount.all;
    activeCount.textContent = memberData.membersCount.active;
    expiresSoonCount.textContent = memberData.membersCount.expiresSoon;
    expiredCount.textContent = memberData.membersCount.expired;
    
    members = memberData.membersList;
    
    const attendedToday = members.filter((m) => m.isAttended === true);
    const absenceToday = members.filter((m) => m.isAttended === false);
    const expiresSoonMember = members.filter((m) => m.status === 'expiresSoon');
    
    attendedCount.textContent = `Attended: ${attendedToday.length}`;
    absenceCount.textContent = `Absence: ${absenceToday.length}`;
    
    saveTodayAttendance(attendedToday.length, absenceToday.length);
    updateAttendanceChart(chart);
    
    if (expiresSoonMember.length <= 0) {
      const noneElement = document.createElement('p');
      noneElement.textContent = 'No expired soon';
      
      expiresSoonContainer.append(noneElement);
      return;
    }
    
    expiresSoonMember.forEach((member) => {
      const memberElement = generateMember(
        member.name,
        member.duration,
        member.id
      );
      
      expiresSoonContainer.append(memberElement);
    });
  } catch (error) {
    console.error(error.message);
  }
}

function generateMember(name, expires, id) {
  const memberContainer = document.createElement('div');
  const memberName = document.createElement('h3');
  const memberExpires = document.createElement('p');
  const memberId = document.createElement('p');
  
  memberContainer.classList.add('member');
  memberContainer.id = id;
  
  memberName.textContent = name;
  memberId.textContent = `ID: ${id}`;
  memberExpires.textContent = `Expires in ${expires}`;
  if (expires === null) {
    memberExpires.textContent = 'Expires in: Never (Lifetime)';
  } else if (expires < 0) {
    memberExpires.textContent = `Expired ${Math.abs(expires)} days ago`;
  } else {
    memberExpires.textContent = `Expires in ${expires} days`;
  }
  memberContainer.append(memberName, memberExpires, memberId);
  
  return memberContainer;
}

document.addEventListener('DOMContentLoaded', async (e) => {
  await init();
  createAttendanceChart(chart);
  await loadMembers();
  
  setInterval(async () => {
    await loadMembers();
  }, 20000);
});