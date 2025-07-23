"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { FavoritesAPI } from "../lib/api-helpers";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
const FavoritesContext = createContext(undefined);
export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error("useFavorites must be used within a FavoritesProvider");
    }
    return context;
}
export function FavoritesProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);
    const { data: session } = useSession();
    const [favorites, setFavorites] = useState({
        properties: [],
        agents: [],
        builders: [],
        projects: [],
        localities: []
    });
    // Check if an item is in favorites
    const isFavorite = useCallback((id, type) => {
        const key = `${type}s`;
        if (!favorites || !favorites[key]) {
            return false;
        }
        return favorites[key].includes(id);
    }, [favorites]);
    // Fetch all favorites from the API
    const refreshFavorites = useCallback(async () => {
        if (!session)
            return;
        setIsLoading(true);
        try {
            // Fetch properties
            const propertiesRes = await FavoritesAPI.getProperties();
            // Fetch agents
            const agentsRes = await FavoritesAPI.getAgents();
            // Fetch builders
            const buildersRes = await FavoritesAPI.getBuilders();
            // Fetch projects
            const projectsRes = await FavoritesAPI.getProjects();
            // Fetch localities
            const localitiesRes = await FavoritesAPI.getLocalities();
            setFavorites({
                properties: propertiesRes.favorites.map((fav) => fav._id),
                agents: agentsRes.favorites.map((fav) => fav._id),
                builders: buildersRes.favorites.map((fav) => fav._id),
                projects: projectsRes.favorites.map((fav) => fav._id),
                localities: localitiesRes.favorites
            });
        }
        catch (_error) {
        }
        finally {
            setIsLoading(false);
        }
    }, [session]);
    // Initial load of favorites
    useEffect(() => {
        if (session) {
            refreshFavorites();
        }
    }, [session, refreshFavorites]);
    const toggleFavorite = useCallback(async (id, type) => {
        const isFav = isFavorite(id, type);
        try {
            switch (type) {
                case "property":
                    if (isFav) {
                        await FavoritesAPI.removeProperty(id);
                        setFavorites(prev => (Object.assign(Object.assign({}, prev), { properties: prev.properties.filter(itemId => itemId !== id) })));
                        toast.success("Property removed from favorites");
                    }
                    else {
                        await FavoritesAPI.addProperty(id);
                        setFavorites(prev => (Object.assign(Object.assign({}, prev), { properties: [...prev.properties, id] })));
                        toast.success("Property added to favorites");
                    }
                    break;
                case "agent":
                    if (isFav) {
                        await FavoritesAPI.removeAgent(id);
                        setFavorites(prev => (Object.assign(Object.assign({}, prev), { agents: prev.agents.filter(itemId => itemId !== id) })));
                        toast.success("Agent removed from favorites");
                    }
                    else {
                        await FavoritesAPI.addAgent(id);
                        setFavorites(prev => (Object.assign(Object.assign({}, prev), { agents: [...prev.agents, id] })));
                        toast.success("Agent added to favorites");
                    }
                    break;
                case "builders":
                    if (isFav) {
                        await FavoritesAPI.removeBuilder(id);
                        setFavorites(prev => (Object.assign(Object.assign({}, prev), { builders: prev.builders.filter(itemId => itemId !== id) })));
                        toast.success("Builder removed from favorites");
                    }
                    else {
                        await FavoritesAPI.addBuilder(id);
                        setFavorites(prev => (Object.assign(Object.assign({}, prev), { builders: [...prev.builders, id] })));
                        toast.success("Builder added to favorites");
                    }
                    break;
                case "project":
                    if (isFav) {
                        await FavoritesAPI.removeProject(id);
                        setFavorites(prev => (Object.assign(Object.assign({}, prev), { projects: prev.projects.filter(itemId => itemId !== id) })));
                        toast.success("Project removed from favorites");
                    }
                    else {
                        await FavoritesAPI.addProject(id);
                        setFavorites(prev => (Object.assign(Object.assign({}, prev), { projects: [...prev.projects, id] })));
                        toast.success("Project added to favorites");
                    }
                    break;
            }
        }
        catch (_error) {
            toast.error(`Failed to update favorites`);
            throw _error;
        }
    }, [isFavorite]);
    const value = {
        favorites,
        isLoading,
        isFavorite,
        toggleFavorite,
        refreshFavorites,
    };
    return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
