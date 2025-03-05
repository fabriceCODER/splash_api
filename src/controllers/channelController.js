import prisma from "@prisma/client";

export const createChannel = async (req, res) => {
    try {
        const { name, location, numStations, plumberId } = req.body;
        const channel = await prisma.Channel.create({ data: { name, location, numStations, plumberId } });
        res.status(201).json(channel);
    } catch (error) {
        res.status(500).json({ message: "Error creating channel", error });
    }
};

export const getAllChannels = async (req, res) => {
    const channels = await prisma.channel.findMany({ include: { plumber: true } });
    res.json(channels);
};

export const updateChannel = async (req, res) => {
    const { id } = req.params;
    const { name, location, numStations, plumberId } = req.body;
    const updatedChannel = await prisma.channel.update({
        where: { id },
        data: { name, location, numStations, plumberId },
    });
    res.json(updatedChannel);
};

export const deleteChannel = async (req, res) => {
    const { id } = req.params;
    await prisma.channel.delete({ where: { id } });
    res.json({ message: "Channel deleted successfully" });
};
