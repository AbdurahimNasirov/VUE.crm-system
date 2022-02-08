import firebase from 'firebase/compat/app'

export default {
    state: {
        categories: []
    },
    actions: {
        async fetchCategories({ commit, dispatch }) {
            try {
                const uid = await dispatch('getUid')
                const categories = (await firebase.database().ref(`/users/${uid}/categories`).once('value')).val() || {}
                commit('setCategories', categories)
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async fetchCategoryById({ commit, dispatch }, id) {
            try {
                const uid = await dispatch('getUid')
                const category = (await firebase.database().ref(`/users/${uid}/categories`).child(id).once('value')).val() || {}
                commit('getCategoryById', category)
                this._vm.$set(category, 'id', id)
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async updateCategory({ commit, dispatch }, { limit, id, title }) {
            try {
                const uid = await dispatch('getUid')
                await firebase.database().ref(`/users/${uid}/categories`).child(id).update({ title, limit })
                commit('updCategory', { limit, id })
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        // async updateCategories({ commit, dispatch }, updata) {
        //     try {
        //         const uid = await dispatch('getUid')
        //         await firebase.database().ref(`/users/${uid}/categories`).update(updata)
        //     } catch (e) {
        //         commit('setError', e)
        //         throw e
        //     }
        // },
        async createCategory({ commit, dispatch }, { title, limit }) {
            try {
                const uid = await dispatch('getUid')
                const category = await firebase.database().ref(`/users/${uid}/categories`).push({ title, limit })
                commit('addCategory', { title, limit })
                return {
                    title, limit, id: category.key
                }
            } catch (e) {
                commit('setError', e)
                throw e
            }
        }
    },
    mutations: {
        setCategories(s, categories) {
            Object.keys(categories).forEach(key => {
                if (!s.categories.some(cat => cat.id === key))
                    s.categories.push({
                        ...categories[key],
                        id: key
                    })
            })
        },
        getCategoryById(s, category) {
            s.categories.push(category)
        },
        addCategory(s, category) {
            s.categories.push(category)
        },
        updCategory(s, category) {
            s.categories.forEach((cat,idx) => {
                if(cat.id == category.id) {
                    s.categories[idx] = category
                }
            })
        }
    },
    getters: {
        getCategories: s => s.categories
    }
}