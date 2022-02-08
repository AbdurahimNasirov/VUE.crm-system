import firebase from "firebase/compat/app"
export default {
    state: {
        records: []
    },
    actions: {
        async createRecord({ dispatch, commit }, record) {
            try {
                const uid = await dispatch('getUid')
                await firebase.database().ref(`/users/${uid}/records`).push(record)
                commit('newRecord', record)

            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async fetchRecords({ dispatch, commit, getters }) {
            try {
                const uid = await dispatch('getUid')
                const records = (await firebase.database().ref(`/users/${uid}/records`).once('value')).val() || {}
                commit('setRecords', { records, categories: getters.getCategories })
            } catch (e) {
                commit('serError', e)
                throw e
            }
        },
        async fetchRecordById({ dispatch, commit }, id) {
            try {
                const uid = await dispatch('getUid')
                const record = (await firebase.database().ref(`/users/${uid}/records`).child(id).once('value')).val() || {}
                this._vm.$set(record, 'id', id)
                commit('getRecordById', record)
            } catch (e) {
                commit('serError', e)
                throw e
            }
        },
        async updateRecord({ commit, dispatch }, { amount, id, description, type, date, categoryId, typeClass,
            categoryName }) {
            try {
                const uid = await dispatch('getUid')
                commit('updRecord', {
                    amount, id, description, type, date, categoryId, typeClass,
                    categoryName
                })
                await firebase.database().ref(`/users/${uid}/records`).child(id).update({
                    amount, categoryId, description, type, date, typeClass,
                    categoryName
                })
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async deleteRecord({ commit, dispatch }, id) {
            try {
                const uid = await dispatch('getUid')
                await firebase.database().ref(`/users/${uid}/records`).child(id).remove()
                commit('deleteRecord', id)
            } catch (e) {
                commit('serError', e)
                throw e
            }
        }
    },
    mutations: {
        setRecords(s, { records, categories }) {
            Object.keys(records).forEach(key => {
                if (!s.records.some(rec => rec.id === key))
                    s.records.push({
                        ...records[key],
                        id: key,
                        categoryName: categories.find((c) => c.id === records[key].categoryId).title,
                        typeClass: records[key].type === "income" ? "green" : "red",
                    })
            })
        },
        deleteRecord(s, id) {
            s.records = s.records.filter(rec => rec.id !== id)
        },
        getRecordById(s, record) {
            s.records.push(record)
        },
        newRecord(s, record) {
            s.records.push(record)
        },
        updRecord(s, record) {
            s.records.forEach((rec, idx) => {
                if (rec.id == record.id) {
                    s.records[idx] = record
                }
            })
        }
    },
    getters: {
        getRecords: s => s.records,
    }
}