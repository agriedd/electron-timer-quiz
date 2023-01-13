import {Team} from 'types/TeamsType';
import {computed, reactive, ref, shallowReactive} from 'vue';

export var teams = reactive<Team[]>([]);

export const teamsOrdered = computed(() => {
  return teams.sort((a: Team, b: Team) => {
    return b.point - a.point;
  });
});

export const isTeamEmpty = computed(() => {
  return teams.length <= 0;
});

export const modalCreate = ref(false);

export const showModalCreate = () => {
  modalCreate.value = true;
};
export const hideModalCreate = () => {
  modalCreate.value = false;
};

export const pushTeam = async (team: Team): Promise<Team | string> => {
  return new Promise<Team | string>((resolve, rejects) => {
    if (teams.find((item: Team) => item.name === team.name)) {
      return rejects('Tim sudah ada 🥲');
    }
    if (team.name.trim().length <= 0) return rejects('Nama tim tidak boleh kosong 🙃');
    if (!team.button_id || team.button_id.length <= 0) return rejects('Wajib button id 🥲');
    teams.push(team);
    return resolve(team);
  });
};
